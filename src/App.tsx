import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const strToNum = (str: string) => {
  if (str == ".") return 0;
  return Number(str);
};

export default function App5() {
  const [refs, setRefs] = useState<RefObject<HTMLInputElement | null>[]>([
    { current: null },
  ]);
  const [inputs, setInputs] = useState<string[]>([""]);
  const currentFocusRef = useRef(0);

  const focusInput = useCallback(
    (i: number) => {
      if (i >= 0 && i < refs.length) refs[i].current?.focus();
    },
    [refs]
  );

  useEffect(() => {
    focusInput(currentFocusRef.current);
  }, [focusInput]);

  const keyDownHandler = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, i: number) => {
      const value = (e.target as HTMLInputElement).value.trim();
      switch (e.key) {
        case "Enter":
          if (!value) break;
          setRefs((refs) => refs.toSpliced(i + 1, 0, { current: null }));
          setInputs((inputs) => inputs.toSpliced(i + 1, 0, ""));
          currentFocusRef.current = i + 1;
          break;
        case "Backspace":
          if ((i > 0 || (i == 0 && refs.length > 1)) && value == "") {
            e.preventDefault();
            setRefs((refs) => refs.toSpliced(i, 1));
            setInputs((inputs) => inputs.toSpliced(i, 1));
            currentFocusRef.current = i - 1;
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          focusInput(i - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          focusInput(i + 1);
          break;
        default:
          break;
      }
    },
    [focusInput, refs.length]
  );

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>, ind: number) => {
      if (e.target.value.match(/^[0-9]*\.?[0-9]*$/))
        setInputs((inp) => inp.toSpliced(ind, 1, e.target.value));
    },
    []
  );

  const deleteInput = useCallback(
    (i: number) => {
      if (i > 0 || (i == 0 && refs.length > 1)) {
        setRefs((refs) => refs.toSpliced(i, 1));
        setInputs((inputs) => inputs.toSpliced(i, 1));
      } else {
        setInputs((inputs) => inputs.toSpliced(i, 1, ""));
      }
    },
    [refs.length]
  );

  const avg = useMemo(() => {
    const sum = inputs.reduce((sum, curr) => sum + strToNum(curr), 0);
    const n = inputs[inputs.length - 1] ? inputs.length : inputs.length - 1;
    return n == 0 ? 0 : sum / n;
  }, [inputs]);

  return (
    <div className="h-dvh bg-gray-200 p-4 flex justify-center">
      <div className="flex flex-col items-center rounded-2xl border border-white w-full max-w-sm neumorphic-card">
        <div className="text-center p-4">
          <h1 className="text-3xl font-semibold text-gray-800">Average</h1>
          <p className="text-4xl font-bold text-indigo-600 mt-2">
            {avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="border-b border-white w-full"></div>
        <div className=" flex flex-col items-center p-4 gap-2 w-full max-w-lg h-full overflow-y-scroll no-scrollbar">
          {refs.map((ref, ind) => (
            <div
              key={ind}
              className="border rounded-md w-full flex neumorphic-input"
            >
              <input
                type="text"
                inputMode="numeric"
                ref={ref}
                value={inputs[ind]}
                onChange={(e) => changeHandler(e, ind)}
                onKeyDown={(e) => keyDownHandler(e, ind)}
                className="border-none outline-none px-4 py-3 w-full"
              />
              <button
                className="w-12 rounded-sm cursor-pointer relative flex justify-center items-center group"
                onClick={() => deleteInput(ind)}
              >
                <div className="w-4 h-0.5 bg-black group-hover:bg-red-400 transition all rounded-full absolute rotate-45"></div>
                <div className="w-4 h-0.5 bg-black group-hover:bg-red-400 transition all rounded-full absolute -rotate-45"></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
