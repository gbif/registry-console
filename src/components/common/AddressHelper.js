import React, {useState, useEffect} from "react"
import { Modal, Button, Tooltip, Card, Popover } from "antd";
import { CopyOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { PresentationItem } from './';
import axios from "axios";
import config from "../../api/util/config"
import _ from "lodash"
const AddressHelper = ({otherResourceEndpoint, otherAdresses=[], form, field}) => {
    const [visible, setVisible] = useState(false)
    const [otherResourceAdresses, setOtherResourceAdresses] = useState([])

    useEffect(()=>{
        if(!!otherResourceEndpoint){
            getAdressesFromOtherResource()
        }
    },[otherResourceEndpoint])

    const getAdressesFromOtherResource = async () => {
        try {
            const res = await axios(`${config.dataApi}${otherResourceEndpoint}`)
            const addresses = [];
            (_.isArray(res?.data?.results ) ? res?.data?.results : [res?.data]).forEach(e => {addresses.push(e?.address); addresses.push(e?.mailingAddress);})
            setOtherResourceAdresses(addresses)

        }
        catch (error) {
            console.log(error)
        }
    }

    const setAddress = (a) => {
        const {key, ...rest} = a
        form.setFieldValue(field, rest)
        setVisible(false)
    }

    return <>
     
      <Popover placement="bottom"  open={visible} 
    title={<FormattedMessage id="reuse.address" defaultMessage="Re-use address" />}
    content={_.uniqBy([...otherAdresses, ...otherResourceAdresses].filter(a => !!a?.address), 'address').map(a => <Card onClick={() => setAddress(a)} hoverable size="small"
      title={null}
      >
        <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address" />}>{a?.address}</PresentationItem>
        <PresentationItem label={<FormattedMessage id="city" defaultMessage="City" />}>{a?.city}</PresentationItem>
        <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province" />}>{a?.province}</PresentationItem>
        <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country" />}>{a?.country}</PresentationItem>
        <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}>{a?.postalCode}</PresentationItem>

    </Card>)}>
        
        <Button type="link" onClick={() => setVisible(!visible)}><CopyOutlined /></Button>
        </Popover> 

    </>
}

export default AddressHelper;
