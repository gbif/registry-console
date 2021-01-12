import React, {useState} from "react";
import { Input, Button } from "antd";
import { updateVocabulary } from "../../../api/vocabulary";
import withContext from '../../hoc/withContext';

const removeEmptyStringsNullAndUndefined = obj => Object.entries(obj).reduce((a,[k,v]) => ( [undefined, null, ""].includes(v) ? a : (a[k]=v, a)), {})


const SingleFieldForm = ({ vocabulary, onSubmit, onCancel, fieldName, addError }) => {

    const [value, setValue] = useState(vocabulary[fieldName]);
   return <React.Fragment>
    <Input
    value={value}
    onChange={ e => setValue(e.currentTarget.value)}
      style={{
        display: "inline-block",
        width: "80%",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      }}
    />
    <Button
      type="primary"
      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      onClick={()=>updateVocabulary(removeEmptyStringsNullAndUndefined({ ...vocabulary, [fieldName]: value }))
      .then(() => onSubmit())
      .catch((error) => {
        addError({
          status: error.response.status,
          statusText: error.response.data,
        });
      })}
    >
      Save
    </Button>
  </React.Fragment>
}

const mapContextToProps = ({ addError }) => ({
  addError
});

export default withContext(mapContextToProps)(SingleFieldForm)

