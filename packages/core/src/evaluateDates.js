import { DateTime, Duration } from "luxon";

export const evaluateDateStr = (str, formData) => {
  const [keyword, sign, durationStr] = str.replace("$d:", "").split(/([+,-])/g);

  let dateTime = DateTime.utc();
  if (keyword !== "now") {
    const formValue = formData[keyword];
    if (!formValue) {
      return null;
    }

    dateTime = DateTime.fromISO(formValue);
  }

  const duration = durationStr && Duration.fromISO(durationStr);

  if (duration) {
    if (sign === "+") {
      dateTime = dateTime.plus(duration);
    }

    if (sign === "-") {
      dateTime = dateTime.minus(duration);
    }
  }

  return dateTime.toISO();
};

export const deepReplaceDatesForJsonSchema = (schema, formData) => {
  // todo replace to ajv parse/serialize
  return JSON.parse(
    JSON.stringify(schema).replace(/"\$d:(.*?)"/g, match => {
      const dateStr = evaluateDateStr(match.replace(/"/g, ""), formData);
      return dateStr ? `"${dateStr}"` : null;
    })
  );

  // const parseNode = (key: string, node: any) => {
  //   if (typeof node === 'string') {
  //     if (!node.startsWith('$d:')) {
  //       return;
  //     }
  //     node[key] = evaluateDateStr(node, formValues);
  //   }

  //   if (Object(node) === node && !Array.isArray(node)) {
  //     Object.entries(node).map(([k, n]) => {
  //       parseNode(k, n);
  //     });
  //   }

  //   if (Array.isArray(node)) {
  //     node.forEach(n => parseNode(key, n));
  //   }
  // };

  // Object.entries(schema).map(([key, node]) => parseNode(key, node));

  // return schema;
};
