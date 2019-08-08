describe('Test Login',() => {
  it('Sucses',async () => {
    cy.request('GET','http://localhost:3000/facebook-search/2383037331934038')
      .then( (res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.length(6)
      })
  })

  it('no auth', () => {
    cy.request('http://localhost:3000/auth/facebook-search')
  })
});