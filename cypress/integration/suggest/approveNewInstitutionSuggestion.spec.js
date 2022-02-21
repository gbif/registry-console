describe('GrScicoll suggest', function () {
  let plainFields = ['name', 'description', 'code', 'homepage', 'catalogUrl', 'apiUrl', 'latitude', 'longitude', 'geographicDescription', 'taxonomicDescription', 'numberSpecimens', 'logoUrl']

  it('can approve new institution suggestion', function () {
    cy.visit('/institution/create');

    cy.fixture('institution').then((institution) => {
      cy.fixture('suggestionInfo').then((suggester) => {

        plainFields.forEach(fieldName => {
          cy.get(`#${fieldName}`)
            .type(institution[fieldName]);
        });

        ['phone', 'email', 'additionalNames'].forEach(fieldName => {
          cy.get(`#${fieldName} .ant-tag`).click();
          cy.get(`#${fieldName} input`).type(`${institution[fieldName][0]}{enter}`);
        });

        if (institution.active) {
          cy.get(`#active`).check();
        }
        if (institution.indexHerbariorumRecord) {
          cy.get(`#indexHerbariorumRecord`).check();
        }

        // addressFields.forEach(fieldName => {
        //   cy.get(`#mailingAddress.${fieldName}`)
        //     .type(institution.mailingAddress[fieldName]);
        // });

        // addressFields.forEach(fieldName => {
        //   cy.get(`#address.${fieldName}`)
        //     .type(institution.address[fieldName]);
        // });
        // cy.get('[name="mailingAddress_address"]')
        //     .type('hej');

        cy.get('#_comment')
          .type(suggester.comments[0]);
        cy.get('#_proposerEmail')
          .type(suggester.proposerEmail);
        
          // cy.get('#createNew').click();
          

      })
    });
  });

})