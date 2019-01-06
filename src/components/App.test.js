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
import Organization from './Organization';
import {
  DatasetConstituent,
  DatasetDeleted,
  DatasetDuplicate,
  DatasetSearch,
  DatasetWithNoEndpoint
} from './search/datasetSearch';
import Dataset from './Dataset';
import { InstallationDeleted, InstallationNonPublishing, InstallationSearch } from './search/installationSearch';
import Installation from './Installation';
import { CollectionSearch, InstitutionSearch, PersonSearch } from './search/grbio';
import Collection from './Collection';
import Institution from './Institution';
import Person from './Person';
import { UserSearch } from './search/userSearch';
import User from './User';
import Exception404 from './exception/404';
import Exception403 from './exception/403';

import messages from '../../public/_translations/en';

const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};
const mockContextObject = {
  changeLocale: jest.fn(),
  notifications: [],
  languages: [],
  countries: [],
  licenses: [],
  installationTypes: []
};
const userEditor = {
  userName: 'editor',
  roles: ['USER', 'REGISTRY_EDITOR']
};
const userAdmin = {
  userName: 'admin',
  roles: ['USER', 'REGISTRY_EDITOR', 'REGISTRY_ADMIN']
};

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('./AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));

describe('<App/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockContextObject);
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

    it('should render 403 instead of Create page for a user without required roles', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/organization/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Organization)).toHaveLength(0);
      expect(wrapper.find(Exception403)).toHaveLength(1);
    });

    it('should render Create page for a user with required roles', () => {
      mockContext.mockReturnValue({
        ...mockContextObject,
        user: userAdmin
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/organization/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Organization)).toHaveLength(1);
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

    it('should render 403 instead of Create page for a user without required roles', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/dataset/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Dataset)).toHaveLength(0);
      expect(wrapper.find(Exception403)).toHaveLength(1);
    });

    it('should render Create page for a user with required roles', () => {
      mockContext.mockReturnValue({
        ...mockContextObject,
        user: userAdmin
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/dataset/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Dataset)).toHaveLength(1);
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

    it('should render 403 instead of Create page for a user without required roles', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/installation/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Installation)).toHaveLength(0);
      expect(wrapper.find(Exception403)).toHaveLength(1);
    });

    it('should render Create page for a user with required roles', () => {
      mockContext.mockReturnValue({
        ...mockContextObject,
        user: userAdmin
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/installation/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Installation)).toHaveLength(1);
    });
  });

  describe('should render GRBIO list pages', () => {
    it('should render Collection Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/collection/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(CollectionSearch)).toHaveLength(1);
    });

    it('should render Institution Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/institution/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(InstitutionSearch)).toHaveLength(1);
    });

    it('should render Person Search', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/person/search']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(PersonSearch)).toHaveLength(1);
    });

    it('should render 403 instead of Collection Create page for a user without required roles', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/collection/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Collection)).toHaveLength(0);
      expect(wrapper.find(Exception403)).toHaveLength(1);
    });

    it('should render 403 instead of Institution Create page for a user without required roles', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/institution/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Institution)).toHaveLength(0);
      expect(wrapper.find(Exception403)).toHaveLength(1);
    });

    it('should render 403 instead of Person Create page for a user without required roles', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/person/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Person)).toHaveLength(0);
      expect(wrapper.find(Exception403)).toHaveLength(1);
    });

    it('should render Collection Create page for a user with required roles', () => {
      mockContext.mockReturnValue({
        ...mockContextObject,
        user: userAdmin
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/collection/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Collection)).toHaveLength(1);
    });

    it('should render Institution Create page for a user with required roles', () => {
      mockContext.mockReturnValue({
        ...mockContextObject,
        user: userAdmin
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/institution/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Institution)).toHaveLength(1);
    });

    it('should render Person Create page for a user with required roles', () => {
      mockContext.mockReturnValue({
        ...mockContextObject,
        user: userAdmin
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/grbio/person/create']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(Person)).toHaveLength(1);
    });
  });

  describe('Users', () => {
    describe('list page', () => {
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
          ...mockContextObject,
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
          ...mockContextObject,
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

    describe('details page', () => {
      it('should render 403 page for unauthorized user', () => {
        const wrapper = mount(
          <MemoryRouter initialEntries={['/user/test']}>
            <App {...appProps}/>
          </MemoryRouter>
        );

        expect(wrapper.find(User)).toHaveLength(0);
        expect(wrapper.find(Exception403)).toHaveLength(1);
      });

      it('should render 403 page for authorized user without ADMIN role', () => {
        mockContext.mockReturnValue({
          ...mockContextObject,
          user: userEditor
        });

        const wrapper = mount(
          <MemoryRouter initialEntries={['/user/test']}>
            <App {...appProps}/>
          </MemoryRouter>
        );

        expect(wrapper.find(User)).toHaveLength(0);
        expect(wrapper.find(Exception403)).toHaveLength(1);
      });
    });

    it('should render User page for a user with ADMIN role', () => {
      mockContext.mockReturnValue({
        ...mockContextObject,
        user: userAdmin
      });

      const wrapper = mount(
        <MemoryRouter initialEntries={['/user/test']}>
          <App {...appProps}/>
        </MemoryRouter>
      );

      expect(wrapper.find(User)).toHaveLength(1);
    });
  });
});
