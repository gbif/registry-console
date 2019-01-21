import React from 'react';
import { injectIntl } from 'react-intl';
import { Card } from 'antd';
import injectSheet from 'react-jss';
import { HasRole, roles } from '../auth';
import Overview from './Overview';

const { Meta } = Card;

const styles = {
};

const Dashboard = () => {
  return (
    <React.Fragment>
      <HasRole roles={[roles.REGISTRY_ADMIN, roles.REGISTRY_EDITOR]}>
        <Overview />
      </HasRole>
      <Card
        title="The GBIF Registry"
        hoverable
        cover={<img alt="example" src="//api.gbif.org/v1/image/unsafe/1170x422/http:%2F%2Fimages.ctfassets.net%2Fuo17ejk9rkwj%2F5q3rzdm22WSa2iYA6im0Oy%2F5ade1f2c77debc6820c875e0f5aaee4a%2FSphaerocoris_annulus.jpg" />}
      >
        <Meta
          title="Manage the entities that make up the GBIF network"
        />
        <div style={{marginTop: 20}}>
          Some prose content about the registry. From contentful? Translation file? Markdown file in project?
        </div>
      </Card>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
};

export default injectSheet(styles)(injectIntl(Dashboard));

