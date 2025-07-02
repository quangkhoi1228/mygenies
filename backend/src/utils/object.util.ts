const properties = Symbol('properties');

// This decorator will be called for each property, and it stores the property name in an object.
export const Property = () => {
  return (obj: any, propertyName: string) => {
    (obj[properties] || (obj[properties] = [])).push(propertyName);
  };
};

// This is a function to retrieve the list of properties for a class
export function getProperties(obj: any): [] {
  return obj.prototype[properties];
}

export function objectMapValues(
  obj: object,
  callback: (value: any, key: string) => unknown,
  ignore: string[] = [],
) {
  for (const key in obj) {
    if (ignore.includes(key)) {
    } else {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // If the property is an object, recursively call the function
          obj[key] = objectMapValues(obj[key], callback, ignore);
        } else {
          // If the property is a value, apply the callback function
          obj[key] = callback(obj[key], key);
        }
      }
    }
  }
  return obj;
}

export function mergeObjectsWithOR(
  obj1: object,
  obj2: object,
  defaultValue?: unknown,
  addKey: boolean = false,
) {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (addKey || obj1.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null) {
        // If the property is an object, recursively call the function
        result[key] = mergeObjectsWithOR(
          result[key] || {},
          obj2[key],
          defaultValue,
          addKey,
        );
      } else {
        // If the property is a value, use the logical OR operation
        result[key] = obj2[key] || result[key] || defaultValue;
      }
    }
  }

  return result;
}

export function mergeObjectsWithAND(obj1: object, obj2: object) {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null) {
        // If the property is an object, recursively call the function
        result[key] = mergeObjectsWithAND(result[key] || {}, obj2[key]);
      } else {
        // If the property is a value, use the logical OR operation
        result[key] = obj2[key] && result[key];
      }
    }
  }

  return result;
}

export function keyAndValueExist(
  obj: object,
  key: string,
  callback: (value: any) => boolean,
) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (prop === key && callback(obj[prop])) {
        return true;
      }
      if (
        typeof obj[prop] === 'object' &&
        keyAndValueExist(obj[prop], key, callback)
      ) {
        return true;
      }
    }
  }
  return false;
}

export function replaceNode(
  obj: object,
  targetNode: string,
  replacement: object,
) {
  const result = { ...obj };

  for (const key in obj) {
    if (key === targetNode) {
      result[key] = replacement;
    } else {
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        // Recursive call for nested objects
        result[key] = replaceNode(result[key] || {}, targetNode, replacement);
      }
    }
  }

  return result;
}

export function mergeObjectsUpdateRemoveKey(
  obj1: object,
  obj2: object,
  toRemove: object = {},
) {
  let result = { ...obj1 };

  for (const key in obj2) {
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null) {
        // If the property is an object, recursively call the function
        result[key] = mergeObjectsUpdateRemoveKey(
          result[key] || {},
          obj2[key],
          toRemove,
        );
      } else {
        // If the property is a value, use the logical OR operation
        result[key] = obj2[key] || result[key];
      }
    } else {
      toRemove[key] = obj2[key];
    }
  }

  // check remove

  // console.log('----------------------------');
  // console.log(toRemove);
  // console.log('----------------------------');

  for (const key in toRemove) {
    const removed = replaceNode(result, key, toRemove[key]);
    result = { ...removed };
  }

  return result;
}

export function addKeyIfNotExistedKey(
  obj: object,
  toAddKey: string,
  callBack: (value: any) => string,
  toCheckKey: string,
  keys: string[] = [],
) {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (!obj[key].hasOwnProperty(toCheckKey)) {
        obj[key][toAddKey] = callBack([...keys, key].join('.')); // You can set the value to whatever you need
      } else {
        obj[key][toCheckKey] = addKeyIfNotExistedKey(
          obj[key][toCheckKey],
          toAddKey,
          callBack,
          toCheckKey,
          [...keys, key],
        );
      }
    }
  }

  return obj;
}

export function removeNullAndUndefined(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => value !== undefined && value !== null,
    ),
  );
}

export function isNotEmpty(value: any) {
  if (value === 0) {
    return true;
  }

  if (!value) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true;
}
