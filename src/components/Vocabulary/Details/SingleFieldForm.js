import React, {useState} from "react";
import { Input, Icon, Button } from "antd";
import { updateVocabulary } from "../../../api/vocabulary";



const SingleFieldForm = ({ vocabulary, onSubmit, onCancel, fieldName }) => {

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
      onClick={()=>updateVocabulary({ ...vocabulary, [fieldName]: value })
      .then(() => onSubmit())
      .catch((error) => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data,
        });
      })}
    >
      Save
    </Button>
  </React.Fragment>
}



export default SingleFieldForm;
