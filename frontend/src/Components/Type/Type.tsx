import { useState } from "react";
import "./Type.scss";
import { fetchDelete, fetchPut } from "../../Services/api";
import { errorToast } from "../../Services/functions";
import { useSelector } from "react-redux";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";

type Props = {
  type: Type
  setType: React.Dispatch<React.SetStateAction<Type[]>>,
  editable: boolean
}

type PutPayload = {
  user: string,
  label: string,
}

const Type = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [newLabel, setNewLabel] = useState<string>(props.type.label ?? "")

  const putType = async () => {
    if (!auth.userConnected?._id) return
    const payload: PutPayload = {
      user: auth.userConnected?._id,
      label: newLabel,
    }
    const modifiedType = await fetchPut(`/type/${props.type._id}`, payload)
    if (modifiedType.error) {
      errorToast(modifiedType)
      return
    }

    props.setType((prev) => prev.map((x) => {
      return x._id === modifiedType.data._id ? modifiedType.data : x
    }))
  }

  const deleteType = async () => {
    const res = await fetchDelete(`/type/${props.type._id}`)
    if (res.error) {
      errorToast(res)
      return
    }
    props.setType((prev) => prev.filter((x) => x._id !== props.type._id))
  }

  return (
    <>
      {props.editable ?
        <div className='type'>
          <div
            className="icon cross"
            style={{ cursor: "pointer" }}
            onClick={() => deleteType()}
          >
            <FaRegTimesCircle></FaRegTimesCircle>
          </div>
          <input
            className="type__label"
            value={newLabel}
            onChange={(e) => {
              if (e.target.value.length < 13) {
                setNewLabel(e.target.value)
              }
            }}
            onBlur={() => {
              if (props.type.label === newLabel) return
              putType()
            }}
          ></input>
        </div>
        : (
          <div className='type'>
            <div className="icon check"><FaRegCheckCircle></FaRegCheckCircle></div>
            <div className="type__label">{newLabel}</div>
          </div>
        )
      }
    </>
  );
};

export default Type;