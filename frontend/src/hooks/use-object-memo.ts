import isEqual from "lodash/isEqual";
import { useState } from "react";

const useObjectMemo = (factory: any, deps: any[] | null) => {
  const [memo, setMemo] = useState({ deps, value: factory() });

  if (!isEqual(deps, memo.deps)) {
    const newValue = factory();
    setMemo({ deps, value: newValue });
    return newValue;
  }

  return memo.value;
};
export default useObjectMemo;
