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
          <img
            alt="example"
            src="//api.gbif.org/v1/image/unsafe/1170x422/http:%2F%2Fimages.ctfassets.net%2Fuo17ejk9rkwj%2F5q3rzdm22WSa2iYA6im0Oy%2F5ade1f2c77debc6820c875e0f5aaee4a%2FSphaerocoris_annulus.jpg"
          />
        }
      >
        <Meta title="Manage the entities that make up the GBIF network" />
        <div style={{ marginTop: 20 }}>
          <h3>Welcome to the GBIF registry console!</h3>
          <p>
            This tool allows users the ability to browse, search and view
            objects in the GBIF registry:
          </p>
          <ul>
            <li>
              <strong>Organizations</strong>: entities who publish{" "}
              <strong>datasets</strong> and/or manage{" "}
              <strong>installations</strong> , e.g.{" "}
              <a href="/organization/2e7df380-8356-4533-bcb3-5459e23c794e">
                Natural History Museum of Denmark
              </a>
            </li>
            <li>
              <strong>Datasets</strong>: collections of data, e.g. species
              occurrences, e.g.{" "}
              <a href="/dataset/ad331dcc-d0fa-4816-b1e6-d36f9f899c49">
                Birds fallen at Danish Lighthouses 1883 through 1939
              </a>
            </li>
            <li>
              <strong>Installations</strong>: servers when{" "}
              <strong>datasets</strong> are hosted, e.g.{" "}
              <a href="/installation/6aca019f-ee9d-4088-859b-5a601d4b093f">
                DanBIF IPT at Aarhus University
              </a>
            </li>
            <li>
              <strong>Collections</strong>: entities describing mainly museum
              collections, e.g.{" "}
              <a href="/collection/9f351d9d-2df2-4d88-9358-ff59abe245aa">
                Hacettepe University Biodiversity Advanced Research Center
                Genbank
              </a>
            </li>
            <li>
              <strong>Institutions</strong>: entities responsible for{" "}
              <strong>collections</strong> , e.g.{" "}
              <a href="/institution/87095cd2-ed2a-4d4b-a97d-885e7e6bedf9">
                Hacettepe University Biodiversity Advanced Research Center
                (BIOSPHERE)
              </a>
            </li>
            <li>
              <strong>GrSciColl Staff</strong>: people associated with{" "}
              <strong>institutions</strong>, e.g.{" "}
              <a href="/person/d4591800-8b5a-44f8-a7a8-e3ea1a59365c">
                Selim Sualp Çağlar
              </a>
            </li>
            <li>
              <strong>Nodes</strong>: entities representing GBIF participants
              responsible for endorsing publishers and coordinating activities
              in a geographic or thematic context, e.g.{" "}
              <a href="/node/4ddd294f-02b7-4359-ac33-0806a9ca9c6b">
                DanBIF - Danish Biodiversity Information Facility
              </a>
            </li>
          </ul>
          <p>
            Registered users with administrative privileges are also able to
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
