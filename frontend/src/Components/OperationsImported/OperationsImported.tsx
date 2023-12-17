import { useEffect, useState } from "react";
import "./OperationsImported.scss";
import { Dropdown } from "primereact/dropdown";

type Props = {
  operation: ImportedOperation,
  setImportedData: React.Dispatch<React.SetStateAction<ImportedOperation[]>>,
  createItem: (item: ImportedOperation) => void,
  typesData: Type[]
}

const OperationsImported = (props: Props) => {
  const [ddType, setDdType] = useState<Type | null>(null)

  useEffect(() => {
    if (props.operation.type) {
      const relatedOP = props.typesData.find((x) => x._id === props.operation.type)
      if (relatedOP) setDdType(relatedOP)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className='operationsimported'>
      <div
        className="pi pi-times"
        onClick={() =>
          props.setImportedData((prev) => prev.filter((x) => x.id !== props.operation.id))
        }
      ></div>
      <div className="operationsimported__name">{props.operation.nom}</div>
      <div className="operationsimported__date">{props.operation.date}</div>
      <div className="operationsimported__value">{props.operation.valeur}</div>
      <Dropdown
        value={ddType}
        options={props.typesData ?? []}
        optionLabel="label"
        onChange={(e) => {
          setDdType(e.value)
        }}
        dropdownIcon={undefined}
        title={ddType?.label}
      ></Dropdown>
      <div
        className="pi pi-check"
        onClick={() => {
          if (!ddType) return
          props.setImportedData((prev) => prev.filter((x) => x.id !== props.operation.id))
          const newItem = {
            ...props.operation,
            type: ddType._id
          }
          props.createItem(newItem)
        }}
      ></div>
    </div>
  );
};

export default OperationsImported;