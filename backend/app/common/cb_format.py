def cb_format(iso: str):
    return ".".join(reversed(iso.split("-")))


def iso_from_cb(cb: str):
    return "-".join(reversed(cb.split('.')))
