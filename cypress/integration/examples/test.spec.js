describe('Test Login',() => {
  var userid = '2383037331934038'
  it('When login sucses result render',async () => {
    cy.request('GET',`http://localhost:3000/facebook-search/${userid}`)
      .then( (res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.length(6)
      })
  })
  
  it('When no login', () => {
    cy.request('http://localhost:3000/auth/facebook-search')
  })
});