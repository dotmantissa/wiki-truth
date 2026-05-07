from __future__ import annotations

import json


def _mock_extract_response(direct_vm, page_title: str, extract: str) -> None:
    direct_vm.mock_web(
        rf".*wikipedia\.org/w/api\.php.*titles={page_title}.*",
        {
            "status": 200,
            "body": json.dumps(
                {
                    "query": {
                        "pages": {
                            "2130": {
                                "pageid": 2130,
                                "title": page_title,
                                "extract": extract,
                            }
                        }
                    }
                }
            ),
        },
    )


def test_is_fact_true_defaults_false(direct_vm, direct_deploy):
    contract = direct_deploy("contract/wiki_truth.py")

    direct_vm.sender = direct_vm.accounts[0]
    assert contract.is_fact_true("Aesthetics", "examining their roles in ethics,") is False


def test_verify_fact_true_path(direct_vm, direct_deploy):
    contract = direct_deploy("contract/wiki_truth.py")

    _mock_extract_response(
        direct_vm,
        "Aesthetics",
        "Many fields investigate aesthetic phenomena, examining their roles in ethics, religion, and everyday life.",
    )

    direct_vm.sender = direct_vm.accounts[0]
    contract.verify_fact("Aesthetics", "examining their roles in ethics,")

    assert contract.is_fact_true("Aesthetics", "examining their roles in ethics,") is True


def test_verify_fact_false_path(direct_vm, direct_deploy):
    contract = direct_deploy("contract/wiki_truth.py")

    _mock_extract_response(
        direct_vm,
        "Aesthetics",
        "Aesthetics is the branch of philosophy that studies beauty and taste.",
    )

    direct_vm.sender = direct_vm.accounts[0]
    contract.verify_fact("Aesthetics", "this phrase does not exist")

    assert contract.is_fact_true("Aesthetics", "this phrase does not exist") is False


def test_verify_fact_accepts_wikipedia_url_input(direct_vm, direct_deploy):
    contract = direct_deploy("contract/wiki_truth.py")

    _mock_extract_response(
        direct_vm,
        "Aesthetics",
        "Many fields investigate aesthetic phenomena, examining their roles in ethics, religion, and everyday life.",
    )

    direct_vm.sender = direct_vm.accounts[0]
    contract.verify_fact(
        "https://en.wikipedia.org/wiki/Aesthetics",
        "examining their roles in ethics,",
    )

    assert contract.is_fact_true("Aesthetics", "examining their roles in ethics,") is True


def test_verify_fact_rejects_empty_inputs(direct_vm, direct_deploy):
    contract = direct_deploy("contract/wiki_truth.py")
    direct_vm.sender = direct_vm.accounts[0]

    with direct_vm.expect_revert("page_title and expected_phrase are required"):
        contract.verify_fact("", "abc")

    with direct_vm.expect_revert("page_title and expected_phrase are required"):
        contract.verify_fact("Aesthetics", "")
