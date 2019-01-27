import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import App from './App';
import Home from './Home';
import {
  OrganizationDeleted,
  OrganizationNonPublishing,
  OrganizationPending,
  OrganizationSearch
} from './search/organizationSearch';
import {
  DatasetConstituent,
  DatasetDeleted,
  DatasetDuplicate,
  DatasetSearch,
  DatasetWithNoEndpoint
} from './search/datasetSearch';
import { InstallationDeleted, InstallationNonPublishing, InstallationSearch } from './search/installationSearch';
import { PersonSearch } from './search/grbioPersonSearch';
import { CollectionSearch } from './search/collectionSearch';
import { InstitutionSearch } from './search/institutionSearch';
import { NodeSearch } from './search/nodeSearch';
import { UserSearch } from './search/userSearch';
import { OverIngested } from './monitoring';
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

    it('should render Organization Deleted', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/organization/deleted']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(OrganizationDeleted)).toHaveLength(1);
    });

    it('should render Organization Pending', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/organization/pending']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(OrganizationPending)).toHaveLength(1);
    });

    it('should render Non Publishing Organization', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/organization/nonPublishing']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(OrganizationNonPublishing)).toHaveLength(1);
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

    it('should render Dataset Deleted', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/dataset/deleted']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(DatasetDeleted)).toHaveLength(1);
    });

    it('should render Dataset Duplicate', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/dataset/duplicate']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(DatasetDuplicate)).toHaveLength(1);
    });

    it('should render Constituent Dataset', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/dataset/constituent']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(DatasetConstituent)).toHaveLength(1);
    });

    it('should render Dataset With No Endpoint', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/dataset/withNoEndpoint']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(DatasetWithNoEndpoint)).toHaveLength(1);
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

    it('should render Installation Deleted', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/installation/deleted']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(InstallationDeleted)).toHaveLength(1);
    });

    it('should render Installation Non Publishing', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/installation/nonPublishing']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(InstallationNonPublishing)).toHaveLength(1);
    });
  });

  describe('should render GRBIO list pages', () => {
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
        <MemoryRouter initialEntries={['/user/search']}>
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
        <MemoryRouter initialEntries={['/user/search']}>
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
        <MemoryRouter initialEntries={['/user/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(UserSearch)).toHaveLength(1);
    });
  });

  describe('OverIngested', () => {
    it('should render OverIngested list page', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/monitoring/overingested']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(OverIngested)).toHaveLength(1);
    });
  });
});
