"""Tests for the Pod's boot pieces that run without a GPU, a network or ComfyUI."""

import json
import os
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "image"))

from bootstrap import __main__ as boot_main  # noqa: E402
from bootstrap.profile import check_paths, opened_workflows, workflow_file  # noqa: E402
from bootstrap.state import BootError, State  # noqa: E402


def profile_with(**parts):
    return {"models": [], "workflows": [], "custom_nodes": [], **parts}


class CheckPathsTest(unittest.TestCase):
    def test_accepts_ordinary_names(self):
        check_paths(profile_with(
            models=[{"name": "model (fp8).safetensors", "directory": "diffusion_models/qwen"}],
            workflows=[{"name": "t2i.json", "folder": "Turbo"}],
            custom_nodes=[{"id": "owner/repo"}],
        ))

    def test_refuses_names_that_leave_their_folder(self):
        for bad in (
            profile_with(models=[{"name": "../x.safetensors", "directory": "loras"}]),
            profile_with(models=[{"name": "x.safetensors", "directory": "loras/../../etc"}]),
            profile_with(workflows=[{"name": "a.json", "folder": ".."}]),
            profile_with(custom_nodes=[{"id": "/abs"}]),
        ):
            with self.subTest(bad=bad), self.assertRaises(BootError):
                check_paths(bad)


class WorkflowPlacementTest(unittest.TestCase):
    def test_opened_workflows_are_the_flagged_ones_or_the_first(self):
        flagged = profile_with(workflows=[{"name": "a", "open": False}, {"name": "b", "open": True}])
        self.assertEqual([w["name"] for w in opened_workflows(flagged)], ["b"])
        unflagged = profile_with(workflows=[{"name": "a"}, {"name": "b"}])
        self.assertEqual([w["name"] for w in opened_workflows(unflagged)], ["a"])

    def test_workflow_file_includes_the_folder(self):
        self.assertEqual(workflow_file({"name": "a.json", "folder": "Turbo"}), "Turbo/a.json")
        self.assertEqual(workflow_file({"name": "a.json"}), "a.json")


class ConfigTest(unittest.TestCase):
    def test_unset_secret_placeholders_count_as_missing(self):
        env = {"HF_TOKEN": "{{ RUNPOD_SECRET_HF_TOKEN }}", "CIVITAI_TOKEN": "  ", "DATA_DIR": "/tmp/x", "DL_CONCURRENCY": "0"}
        with mock.patch.dict(os.environ, env, clear=True):
            config = boot_main.BootConfig.from_env(lambda message: None)
            self.assertIsNone(config.hf_token)
            self.assertIsNone(config.civitai_token)
            self.assertNotIn("HF_TOKEN", os.environ)  # removed so nothing downstream sees the placeholder
        self.assertEqual(config.data_dir, "/tmp/x")
        self.assertEqual(config.concurrency, 1)
        self.assertEqual((config.fail_minutes, config.boot_minutes), (3, 60))


class BootTest(unittest.TestCase):
    def make_boot(self, tmp, boot_minutes=0):
        config = boot_main.BootConfig(
            comfy_dir="/opt/ComfyUI", data_dir=tmp, concurrency=1, hf_token=None, civitai_token=None,
            fail_minutes=0, boot_minutes=boot_minutes,
        )
        return boot_main.Boot(State(), config)

    def test_write_report_records_the_outcome_and_timings(self):
        with tempfile.TemporaryDirectory() as tmp:
            boot = self.make_boot(tmp)
            self.assertEqual(boot.timed("step", lambda: 42), 42)
            boot.write_report("started")
            report = json.loads(Path(tmp, "runpod-boot", "report.json").read_text(encoding="utf-8"))
            self.assertEqual(report["outcome"], "started")
            self.assertIn("step", report["timings"])
            self.assertEqual(report["data_dir"], tmp)

    def test_the_deadline_fails_the_boot_only_if_nothing_decided_first(self):
        with tempfile.TemporaryDirectory() as tmp:
            failed = []
            boot = self.make_boot(tmp, boot_minutes=0.001)  # 60 ms
            with mock.patch.object(boot_main.Boot, "fail", lambda self, error: failed.append(error.code)):
                boot.start_deadline()
                time.sleep(0.3)
            self.assertEqual(failed, ["boot_timeout"])

            failed.clear()
            boot = self.make_boot(tmp, boot_minutes=0.001)
            self.assertTrue(boot.decided.acquire(blocking=False))  # the main thread finished first
            with mock.patch.object(boot_main.Boot, "fail", lambda self, error: failed.append(error.code)):
                boot.start_deadline()
                time.sleep(0.3)
            self.assertEqual(failed, [])


if __name__ == "__main__":
    unittest.main()
