import re

def extraire_chiffre_fin(chaine):
    match = re.search(r'(\d+)$', chaine)  # Recherche un ou plusieurs chiffres à la fin
    return int(match.group(1)) if match else None  # Convertit en entier si trouvé