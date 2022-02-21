import React from "react";
import PropTypes from "prop-types";
import { Modal, Input, Form } from "antd";
import { FormattedMessage } from "react-intl";

// Components
import { FormItem } from "../../index";
// Helpers
import { defaultNameSpace } from "../../../util/helpers";

const DefaultValueCreateForm = (props) => {
  const [form] = Form.useForm();
  const { visible, onCancel, onCreate } = props;

  return (
    <Modal
      visible={visible}
      title={
        <FormattedMessage
          id="createNewDefaultValue"
          defaultMessage="Create a new default value"
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
        {/* We have a default value for the namespace field. */}
        {/* This is the only one thing that differ default values from machine tags */}
        {/*     {getFieldDecorator('namespace', {
                initialValue: defaultNameSpace
              })(<Input style={{ display: 'none' }}/>)} */}
        <FormItem
          style={{ display: "none" }}
          name="namespace"
          initialValue={defaultNameSpace}
          label={<FormattedMessage id="name" defaultMessage="Name" />}
          helpText={
            <FormattedMessage
              id="help.mtName"
              defaultMessage="The name for the tag (e.g. basisOfRecord, type)."
            />
          }
        >
          <Input  style={{ display: "none" }}/>
        </FormItem>

        <FormItem
          name="name"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="provide.name"
                  defaultMessage="Please provide a name"
                />
              ),
            },
          ]}
          label={<FormattedMessage id="name" defaultMessage="Name" />}
          helpText={
            <FormattedMessage
              id="help.mtName"
              defaultMessage="The name for the tag (e.g. basisOfRecord, type)."
            />
          }
        >
          <Input />
        </FormItem>

        <FormItem
          name="value"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="provide.value"
                  defaultMessage="Please provide a value"
                />
              ),
            },
          ]}
          label={<FormattedMessage id="value" defaultMessage="Value" />}
          helpText={
            <FormattedMessage
              id="help.mtValue"
              defaultMessage="The value for the tag (e.g. Living specimen, MANIS)."
            />
          }
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
};

DefaultValueCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default DefaultValueCreateForm;
