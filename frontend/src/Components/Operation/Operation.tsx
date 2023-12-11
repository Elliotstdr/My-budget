import { useState } from "react";
import "./Operation.scss";
import { fetchDelete, fetchPut } from "../../Services/api";
import { errorToast } from "../../Services/functions";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

interface Props {
  operation: Operation
  setOperations: React.Dispatch<React.SetStateAction<Operation[]>>
  types: Type[]
}

interface PutPayload {
  label: string,
  value: number
}

const Operation = (props: Props) => {
  const [newLabel, setNewLabel] = useState<string>(props.operation.label ?? "")
  const [newValue, setNewValue] = useState<string>(props.operation.value.toString() ?? "")
  const [ddType, setDdType] = useState<Type | null>(
    props.types.find((x) => props.operation?.type?._id === x._id) ?? null
  )

  const putOperation = async () => {
    const payload: PutPayload = {
      label: newLabel,
      value: Number(newValue)
    }
    const modifiedOperation = await fetchPut(`/operation/${props.operation._id}`, payload)
    if (modifiedOperation.error) {
      errorToast(modifiedOperation)
      return
    }

    props.setOperations((prev) => prev.map((x) => {
      return x._id === modifiedOperation.data._id ? modifiedOperation.data : x
    }))
  }

  const putType = async (type: Type) => {
    const modifiedOperation = await fetchPut(`/operation/${props.operation._id}`, { type: type })
    if (modifiedOperation.error) {
      errorToast(modifiedOperation)
      return
    }

    props.setOperations((prev) => prev.map((x) => {
      return x._id === modifiedOperation.data._id ? modifiedOperation.data : x
    }))
  }

  const deleteOperation = async () => {
    const res = await fetchDelete(`/operation/${props.operation._id}`)
    if (res.error) {
      errorToast(res)
      return
    }
    props.setOperations((prev) => prev.filter((x) => x._id !== props.operation._id))
  }

  return (
    <div className='operation'>
      <div
        className="pi pi-times"
        style={{ cursor: "pointer" }}
        onClick={() => deleteOperation()}
      ></div>
      <InputText
        className="operation__label"
        title={newLabel}
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
        onBlur={() => {
          if (props.operation.label === newLabel) return
          putOperation()
        }}
      ></InputText>
      <InputText
        className="operation__value"
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
        onBlur={() => {
          if (props.operation.value.toString() === newLabel) return
          putOperation()
        }}
      ></InputText>
      <Dropdown
        value={ddType}
        options={props.types}
        optionLabel="label"
        className="operation__type"
        onChange={(e) => {
          setDdType(e.value)
          e.value && putType(e.value)
        }}
        title={ddType?.label}
      ></Dropdown>
    </div>
  );
};

export default Operation;