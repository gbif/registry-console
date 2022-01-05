import fieldFormatter from "./fieldFormatter";
import { getOrganization } from '../../api/organization'

const OrganizationTitle = fieldFormatter(id => getOrganization(id));

export default OrganizationTitle;