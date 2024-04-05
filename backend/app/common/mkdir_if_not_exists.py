import os


def mkdir_if_not_exists(directory: str):
    if not os.path.exists(directory):
        os.mkdir(directory)
