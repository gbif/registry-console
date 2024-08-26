import React from "react";
import { injectIntl } from "react-intl";
import { Card } from "antd";
import injectSheet from "react-jss";
import { HasRole, roles } from "../auth";
import Overview from "./Overview";

const { Meta } = Card;

const styles = {};

const Dashboard = () => {
  return (
    <React.Fragment>
      <HasRole roles={roles.REGISTRY_EDITOR}>
        <Overview />
      </HasRole>
      <Card
        title="The GBIF Registry"
        hoverable
        cover={
          <div style={{ minHeight:'422px', backgroundSize: 'cover', backgroundImage: 'url(//api.gbif.org/v1/image/unsafe/1170x422/http:%2F%2Fimages.ctfassets.net%2Fuo17ejk9rkwj%2F5q3rzdm22WSa2iYA6im0Oy%2F5ade1f2c77debc6820c875e0f5aaee4a%2FSphaerocoris_annulus.jpg)'}}>
          {/* <img
            alt="example"
            src="//api.gbif.org/v1/image/unsafe/1170x422/http:%2F%2Fimages.ctfassets.net%2Fuo17ejk9rkwj%2F5q3rzdm22WSa2iYA6im0Oy%2F5ade1f2c77debc6820c875e0f5aaee4a%2FSphaerocoris_annulus.jpg"
          />  */}
          <div className="img_caption">
          <a href="https://www.gbif.org/occurrence/1890683414">Picasso bug (<i>Sphaerocoris annulus</i>) by hubertus via iNaturalist.</a> <a href="http://creativecommons.org/licenses/by-nc/4.0/">Photo licensed under CC BY-NC 4.0</a>.
          </div>
          </div>
        }
      >
        <Meta title="Manage the entities that make up the GBIF network" />
        <div style={{ marginTop: 20 }}>
          <h3>Welcome to the GBIF registry console!</h3>
          <p>
            This is a data management tool for the GBIF network. Here you can edit and view metadata about the entities that make up the GBIF network.{" "}
            For a more public facing view of the data, please visit <a href="https://www.gbif.org">www.gbif.org</a>.
          </p>
          <p>For collections and institutions there is the option to suggest a change without having a user account.</p>
          <p>
            Registered users with administrative privileges are able to
            edit certain objects. Please contact{" "}
            <a href="mailto:helpdesk@gbif.org">helpdesk@gbif.org</a> if you
            don't have access or the privileges you believe are appropriate for
            your role.
          </p>
        </div>
      </Card>
    </React.Fragment>
  );
};

Dashboard.propTypes = {};

export default injectSheet(styles)(injectIntl(Dashboard));
