export const dateTimeFormat = {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short'
};

export const formItemLayout = isModal => ({
  labelCol: {
    sm: { span: 24 },
    md: { span: 8 },
    style: {
      textAlign: 'right',
      paddingRight: '8px',
      lineHeight: '32px',
      fontWeight: 500
    }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 16 },
    style: {
      lineHeight: '32px'
    }
  },
  style: {
    paddingBottom: 0,
    marginBottom: isModal ? '0px' : '15px',
    minHeight: '32px'
  }
});