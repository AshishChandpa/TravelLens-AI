def test_get_sample(client) -> None:
    response = client.get("/sample")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["message"] == "This is a sample route using helper and model!"
    assert json_data["data"] == "Example"
    assert json_data["success"] is True
