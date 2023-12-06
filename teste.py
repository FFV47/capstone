original_dict = {"a": 1, "b": 2, "c": 3, "d": 4}
keys_to_remove = ["b", "d"]

# Remove key-value pair with value 2
for key in list(original_dict.keys()):
    if key in keys_to_remove:
        original_dict.pop(key)

print(original_dict)
