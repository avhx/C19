import requests
import json
from io import StringIO

administrative_boundaries = {
  "Anderson":1848164,
  "Bedford":1848165,
  "Benton":1847610,
  "Bledsoe":1848166,
  "Blount":1848167,
  "Bradley":1848168,
  "Campbell":1847611,
  "Cannon":1848169,
  "Carroll":1847612,
  "Carter":1847613,
  "Cheatham":1847614,
  "Chester":1847615,
  "Claiborne":1847616,
  "Clay":1847617,
  "Cocke":1848170,
  "Coffee":1848171,
  "Crockett":1847618,
  "Cumberland":1848172,
  "Davidson":1847619,
  "Decatur":1847620,
  "DeKalb":1848173,
  "Dickson":1847621,
  "Dyer":1828575,
  "Fayette":1829178,
  "Fentress":1848174,
  "Franklin":1848175,
  "Gibson":1847622,
  "Giles":1848176,
  "Grainger":1848177,
  "Greene":1848178,
  "Grundy":1848179,
  "Hamblen":1848180,
  "Hamilton":1848181,
  "Hancock":1847623,
  "Hardeman":1847624,
  "Hardin":1847625,
  "Hawkins":1847626,
  "Haywood":1828576,
  "Henderson":1847627,
  "Henry":1847628,
  "Hickman":1847629,
  "Houston":1847630,
  "Humphreys":1847631,
  "Jackson":1848182,
  "Jefferson":1848183,
  "Johnson":1847632,
  "Knox":1848184,
  "Lake":1847633,
  "Lauderdale":1828577,
  "Lawrence":1848185,
  "Lewis":1847709,
  "Lincoln":1848186,
  "Loudon":1848187,
  "Macon":1847634,
  "Madison":1847635,
  "Marion":1848188,
  "Marshall":1848189,
  "Maury":1364501,
  "McMinn":1848190,
  "McNairy":1847636,
  "Meigs":1847816,
  "Monroe":1848191,
  "Montgomery":1847637,
  "Moore":1848192,
  "Morgan":1848193,
  "Obion":1847638,
  "Overton":1848194,
  "Perry":1847639,
  "Pickett":1847640,
  "Polk":1848195,
  "Putnam":1848196,
  "Rhea":1848197,
  "Roane":1848198,
  "Robertson":1847641,
  "Rutherford":1848199,
  "Scott":1847642,
  "Sequatchie":1848200,
  "Sevier":1848201,
  "Shelby":1829139,
  "Smith":1848202,
  "Stewart":1847643,
  "Sullivan":1847644,
  "Sumner":1847645,
  "Tipton":1828578,
  "Trousdale":1848203,
  "Unicoi":1848204,
  "Union":1848205,
  "VanBuren":1848206,
  "Warren":1848222,
  "Washington":1848223,
  "Wayne":1848224,
  "Weakley":1847646,
  "White":1848225,
  "Williamson":1847647,
  "Wilson":1848226,
}

all_points = []
jsonFile = "TNCounties.json"

for key, value in administrative_boundaries.items():
  print("Processing " + key)
  r = requests.get('http://polygons.openstreetmap.fr/get_poly.py?id=' + str(value) + '&params=0')
  points = []
  for line in r.text.splitlines():
    if line != "END" and line != "polygon" and line != "1":
      x = line.split()
      points.append({"lat": float(x[1]), "lng": float(x[0])})

  wrap_points = [{"name": key}, {"points": points}]
  all_points.append(wrap_points)

with open(jsonFile, 'w') as f:
  json.dump(all_points, f, sort_keys=False, indent=4)