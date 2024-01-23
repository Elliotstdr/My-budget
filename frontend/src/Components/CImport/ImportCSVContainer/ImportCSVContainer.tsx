import { useState } from "react";
import "./ImportCSVContainer.scss";
import { FileUpload, FileUploadFilesEvent } from 'primereact/fileupload';
import { fetchPost, useFetchGet } from "../../../Services/api";
import { useSelector } from "react-redux";
import { errorToast } from "../../../Services/functions";
import OperationsImported from "../../OperationsImported/OperationsImported";
import { Divider } from "primereact/divider";
import Operation from "../../Operation/Operation";
import double from '../../../assets/Cross.jpg'
import simple from '../../../assets/Simple.jpg'
import ReturnButton from "../../UI/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";
import { SelectButton } from "primereact/selectbutton";

const ImportCSVContainer = () => {
  const items = [
    { name: 'Simple', value: 1 },
    { name: 'Croisé', value: 2 }
  ];
  const navigate = useNavigate()
  const typesData = useFetchGet<Type[]>("/type")
  const auth = useSelector((state: RootState) => state.auth);
  const [successImport, setSuccessImport] = useState(false)
  const [importedData, setImportedData] = useState<ImportedOperation[]>([])
  const [validatedData, setValidatedData] = useState<Operation[]>([])
  const [selectValue, setSelectValue] = useState<1 | 2>(1)

  const uploadHandler = async ({ files }: FileUploadFilesEvent) => {
    if (!auth.userConnected) return
    const file = files[0];

    const formData = new FormData();
    formData.append('file', file);

    const url = selectValue === 1
      ? `/file/treat/for_user/${auth.userConnected._id}`
      : `/file/treat/double/for_user/${auth.userConnected._id}`

    const res = await fetchPost(url, formData)
    if (res.error) {
      errorToast(res)
      // "Une erreur est survenue lors de l'import de votre csv. Peut-être qu'une des consignes n'a pas été respectée."
      return
    }
    if (res.data.length === 0) {
      errorToast("Aucune opération n'a pu être extraite de ce fichier")
      return
    }

    setSuccessImport(true)
    setImportedData(res.data.map((x: Partial<ImportedOperation>, key: number) => {
      return {
        ...x,
        id: key
      }
    }))
  };

  const createItem = async (item: ImportedOperation) => {
    if (!auth.userConnected || !item.type) return

    const dateParts = item.date.split("/");
    const dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
    dateObject.setHours(dateObject.getHours() + 12)

    const payload: NewOperation = {
      label: item.nom,
      value: Number(item.valeur),
      type: item.type,
      user: auth.userConnected._id,
      datePeriod: dateObject
    }

    const newOperation = await fetchPost("/operation", payload)
    if (newOperation.error) {
      errorToast(newOperation)
      return
    }

    setValidatedData((prev) => [...prev, newOperation.data])
  }

  return (
    <div className='importCSV page'>
      <ReturnButton
        action={() => { successImport ? setSuccessImport(false) : navigate("/import") }}
      ></ReturnButton>
      {!successImport ?
        <>
          <div className='importCSV__information'>
            <div className="importCSV__information__switch">
              <SelectButton
                value={selectValue}
                onChange={(e) => e.value && setSelectValue(e.value)}
                optionLabel="name"
                options={items}
                style={{ margin: "1rem 0" }}
              />
            </div>
            <img
              className="importCSV__information__image"
              src={selectValue === 1 ? simple : double}
              alt="exemple tableau"
            />
            {selectValue === 1 ? (
              <ul>
                <li>Le fichier doit être au format <b>.csv</b> ou <b>.xlsx</b></li>
                <li>La case A1 doit contenir le mot "date", la case A2 le mot "nom" et la case A3 le mot "valeur"</li>
                <li>La première colonne contient la date de l'opération au format <b>jj/mm/aaaa</b></li>
                <li>La deuxième colonne contient la description de l'opération</li>
                <li>La dernière colonne contient le montant (négatif pour les dépenses)</li>
              </ul>
            ) : (
              <ul>
                <li>Le fichier doit être au format <b>.csv</b> ou <b>.xlsx</b></li>
                <li>Mettre en ligne la date de l'opération au format <b>jj/mm/aaaa</b></li>
                <li>Mettre en colonne le type de l'opération</li>
                <li>Mettre à l'intérieur du tableau les valeurs (négatif pour les dépenses)</li>
              </ul>
            )}
          </div>
          <FileUpload
            accept=".csv, .xlsx"
            maxFileSize={1000000}
            className="upload_csv"
            customUpload={true}
            uploadHandler={uploadHandler}
            chooseLabel="Ajouter un fichier"
            auto
          />
        </>
        : <div>
          {importedData.map((x) =>
            <OperationsImported
              key={x.id}
              operation={x}
              setImportedData={setImportedData}
              createItem={(item) => createItem(item)}
              typesData={typesData?.data as Type[] | null ?? []}
            ></OperationsImported>
          )}
          <Divider></Divider>
          {validatedData.map((x) =>
            <Operation
              key={x._id}
              operation={x}
              setOperations={setValidatedData}
              types={typesData.data ?? []}
            ></Operation>
          )}
        </div>
      }
    </div>
  );
};

export default ImportCSVContainer;