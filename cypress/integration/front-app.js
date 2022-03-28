describe('Some basics tests', () => {
    it('Should open and fetch PR from repo link', () => {
        cy.visit('http://127.0.0.1:3000/');
        cy.get("input[name='repo-url']").clear().type('https://github.com/mui/material-ui')
        cy.get("#provide-repo-screen-submit").click()

        cy.get(".pr-family").its('length').should('be.greaterThan', 0)
    })
})