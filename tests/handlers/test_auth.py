import unittest

from src.handlers.auth import generate_verification_code


class TestAuth(unittest.TestCase):
    def test_generate_verification_code(self):
        verification_code = generate_verification_code()
        self.assertRegex(verification_code, r"^[0-9]{5}$")

    def test_generate_verification_code_not_repetitive(self):
        self.assertNotEqual(
            generate_verification_code(),
            generate_verification_code())

