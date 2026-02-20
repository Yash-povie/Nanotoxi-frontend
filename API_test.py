import requests

url = "https://web-production-6a673.up.railway.app/predict"

data = {
    "nanoparticle_id": "CuO_30nm_test",
    "core_size": 30.0,
    "zeta_potential": -28.0,
    "surface_area": 95.0,
    "bandgap_energy": 1.2,
    "electric_charge": -1,
    "oxygen_atoms": 1,
    "dosage": 40.0,
    "exposure_time": 24.0,
    "environmental_pH": 6.5,
    "protein_corona": False
}

response = requests.post(url, json=data)
result = response.json()

print(f"Toxicity: {result['stage2']['toxicity_prediction']}")
print(f"Confidence: {result['stage2']['confidence']}")
print(f"Risk Level: {result['stage2']['risk_level']}")