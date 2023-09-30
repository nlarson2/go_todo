const scripts = [
  `\u2070`,
  `\u00B9`,
  `\u00B2`,
  `\u00B3`,
  `\u2074`,
  `\u2075`,
  `\u2076`,
  `\u2077`,
  `\u2078`,
  `\u2079`,
];

interface SuperScriptProp {
  value: number;
}

function SuperScript(scriptProp: SuperScriptProp) {
  const value: string[] = scriptProp.value.toString().split("");

  return (
    <>
      {value.map((str) => (
        <>{scripts[parseInt(str)]}</>
      ))}
    </>
  );
}

export default SuperScript;
