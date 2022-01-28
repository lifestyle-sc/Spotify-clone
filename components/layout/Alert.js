import { InformationCircleIcon } from "@heroicons/react/outline";
import { useRecoilValue } from "recoil";
import { errorMsgState } from "../../atom/errorAtom";

const Alert = () => {
  const errorMsg = useRecoilValue(errorMsgState);
  return (
    errorMsg !== null && (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">
          <InformationCircleIcon className="w-5 h-5 inline" /> {errorMsg}
        </span>
      </div>
    )
  );
};

export default Alert;
