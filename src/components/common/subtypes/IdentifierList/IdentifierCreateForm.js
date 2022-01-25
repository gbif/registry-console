import React, {useState, useEffect} from "react";
import { Modal, Input, Select, Spin, Form } from "antd";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

// APIs
import { getIdentifierTypes } from "../../../../api/enumeration";
// Components
import { FormItem } from "../../index";
const IdentifierCreateForm = (props) => {
  const [identifierTypes, setIdentifierTypes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [form] = Form.useForm();
  useEffect(() => {
    getIdentifierTypes().then((types) => {
      setIdentifierTypes(types);
      setFetching(false);
    });
  }, []);

  const { visible, onCancel, onCreate } = props;

  return (
    <Modal
      visible={visible}
      title={
        <FormattedMessage
          id="createNewIdentifier"
          defaultMessage="Create a new identifier"
        />
      }
      okText={<FormattedMessage id="create" defaultMessage="Create" />}
      onCancel={onCancel}
      onOk={() => onCreate(form)}
      destroyOnClose={true}
      maskClosable={false}
      closable={false}
    >
      <Form form={form}>
        <FormItem
          name="identifier"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="provide.identifier"
                  defaultMessage="Please provide an identifier"
                />
              ),
            },
          ]}
          label={
            <FormattedMessage id="identifier" defaultMessage="Identifier" />
          }
          helpText={
            <FormattedMessage
              id="help.identifier"
              defaultMessage="The value for the identifier (e.g. doi://12.123/123)."
            />
          }
        >
          <Input />
        </FormItem>
        <FormItem
          name="type"
          label={<FormattedMessage id="type" defaultMessage="Type" />}
          helpText={
            <FormattedMessage
              id="help.identifierType"
              defaultMessage="Select the type of the identifier."
            />
          }
        >
          <Select
            placeholder={
              <FormattedMessage
                id="select.type"
                defaultMessage="Select a type"
              />
            }
            notFoundContent={fetching ? <Spin size="small" /> : null}
          >
            {identifierTypes.map((identifierType) => (
              <Select.Option value={identifierType} key={identifierType}>
                {identifierType}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

IdentifierCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default IdentifierCreateForm;
