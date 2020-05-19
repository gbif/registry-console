import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import App from './App';
import Home from './Home';
import { OrganizationSearch } from './search/organizationSearch';
import { DatasetSearch } from './search/datasetSearch';
import { InstallationSearch } from './search/installationSearch';
import { PersonSearch } from './search/grscicollPersonSearch';
import { CollectionSearch } from './search/collectionSearch';
import { InstitutionSearch } from './search/institutionSearch';
import { NodeSearch } from './search/nodeSearch';
import { UserSearch } from './search/userSearch';
import { IngestionHistory } from './monitoring';
import { NetworkSearch } from './search/networkSearch';
import Exception404 from './exception/404';
import Exception403 from './exception/403';

import { mockedContext, userAdmin, userEditor } from '../__mocks__/context.mock';

import messages from '../../public/_translations/en';

const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('./AppContext', () => ({
  Consumer: ({ children }) => children(mockContext())
}));

describe('<App/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('invalid path should redirect to 404', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Home)).toHaveLength(0);
    expect(wrapper.find(Exception404)).toHaveLength(1);
  });

  it('should render Dashboard', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Home)).toHaveLength(1);
  });

  describe('should render Organization list pages', () => {
    it('should render Organization Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/organization/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(OrganizationSearch)).toHaveLength(1);
    });
  });

  describe('should render Dataset list pages', () => {
    it('should render Dataset Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/dataset/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(DatasetSearch)).toHaveLength(1);
    });
  });

  describe('should render Network list pages', () => {
    it('should render Network Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/network/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(NetworkSearch)).toHaveLength(1);
    });
  });

  describe('should render Installation list pages', () => {
    it('should render Installation Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/installation/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(InstallationSearch)).toHaveLength(1);
    });
  });

  describe('should render GrSciColl list pages', () => {
    it('should render Collection Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/collection/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(CollectionSearch)).toHaveLength(1);
    });

    it('should render Institution Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/institution/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(InstitutionSearch)).toHaveLength(1);
    });

    it('should render Person Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/person/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(PersonSearch)).toHaveLength(1);
    });
  });

  describe('Nodes', () => {
    it('should render Node list page', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/node/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(NodeSearch)).toHaveLength(1);
    });
  });

  describe('Users', () => {
    it('should render 403 page for unauthorized user', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/user']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(UserSearch)).toHaveLength(0);
      expect(wrapper.find(Exception403)).toHaveLength(1);
    });

    it('should render 403 page for authorized user without ADMIN role', () => {
      mockContext.mockReturnValue({
        ...mockedContext,
        user: userEditor
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/user']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(UserSearch)).toHaveLength(0);
      expect(wrapper.find(Exception403)).toHaveLength(1);
    });

    it('should render User list page for a user with ADMIN role', () => {
      mockContext.mockReturnValue({
        ...mockedContext,
        user: userAdmin
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/user']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(UserSearch)).toHaveLength(1);
    });
  });

  describe('Monitoring', () => {
    // it('should render OverIngested list page', () => {
    //   const wrapper = mount(
    //     <MemoryRouter initialEntries={['/monitoring/overingested']}>
    //       <App {...appProps}/>
    //     </MemoryRouter>
    //   );

    //   expect(wrapper.find(OverIngested)).toHaveLength(1);
    // });

    it('should render RunningIngestion list page', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/monitoring/ingestion-history']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(IngestionHistory)).toHaveLength(1);
    });
  });
});
