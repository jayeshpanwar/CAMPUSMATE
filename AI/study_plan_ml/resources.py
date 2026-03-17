RESOURCE_MAP = {
    'math': [
        ('Khan Academy - Algebra', 'https://www.khanacademy.org/math/algebra'),
        ('Khan Academy - Calculus', 'https://www.khanacademy.org/math/calculus-1'),
    ],
    'physics': [
        ('Khan Academy - Physics', 'https://www.khanacademy.org/science/physics'),
        ('NPTEL - Engineering Physics', 'https://nptel.ac.in/courses/115'),
    ],
    'chemistry': [
        ('Khan Academy - Chemistry', 'https://www.khanacademy.org/science/chemistry'),
        ('NPTEL - Basic Chemistry', 'https://nptel.ac.in/courses/104'),
    ],
    'english': [
        ('British Council - Reading', 'https://learnenglish.britishcouncil.org/skills/reading'),
        ('British Council - Writing', 'https://learnenglish.britishcouncil.org/skills/writing'),
    ],
    'programming': [
        ('freeCodeCamp - JavaScript', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/'),
        ('NPTEL - Programming in C', 'https://nptel.ac.in/courses/106'),
    ],
}


def get_resources(subject_name: str):
    lowered = subject_name.lower()
    for key, resources in RESOURCE_MAP.items():
        if key in lowered:
            return resources
    return [
        (f'Khan Academy - {subject_name}', f'https://www.khanacademy.org/search?page_search_query={subject_name.replace(" ", "+")}'),
        (f'NPTEL - {subject_name}', f'https://nptel.ac.in/noc/en/search?query={subject_name.replace(" ", "+")}'),
    ]
