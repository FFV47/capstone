type JSONValue = string | number | boolean | File | { [x: string]: JSONValue } | Array<JSONValue>;

type JSONObject = {
  [x: string]: JSONValue;
};

export default function jsonToFormData(obj: JSONObject, ignoreList?: string[]) {
  const formData = new FormData();

  for (const key in obj) {
    if (ignore(key)) continue;
    appendFormData(key, obj[key]);
  }

  return formData;

  function ignore(root: string) {
    return ignoreList && Array.isArray(ignoreList) && ignoreList.some((x) => x === root);
  }

  function appendFormData(jsonKey: string, data: JSONValue) {
    if (data instanceof File) {
      formData.append(jsonKey, data);
    } else if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        appendFormData(jsonKey + "[" + i + "]", data[i]);
      }
    } else if (typeof data === "object" && data) {
      for (const key in data) {
        if (Object.hasOwn(data, key)) {
          if (jsonKey === "") {
            appendFormData(key, data[key]);
          } else {
            appendFormData(jsonKey + "." + key, data[key]);
          }
        }
      }
    } else {
      if (data != null) {
        formData.append(jsonKey, String(data));
      }
    }
  }
}
