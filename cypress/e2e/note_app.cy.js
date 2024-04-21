describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login test', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('hellas')
      cy.get('#password').type('hellas')
      cy.get('button[type="submit"]').click()

      cy.contains('logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.contains('Wrong username or password')
    })
  })

  describe('Blog Page', function() {
    beforeEach(function() {
      cy.visit('http://localhost:5173')
      cy.get('#username').type('hellas')
      cy.get('#password').type('hellas')
      cy.get('button[type="submit"]').click()
    })

    it('A blog can be created', function() {
      cy.get('#showBlogForm').click()
      cy.get('#title').type('Cypress Test Blog Title')
      cy.get('#author').type('Test Author')
      cy.get('#URL').type('https://www.example.com')
      cy.get('#createBlog').click()

      cy.contains('Test Blog Title')
    })

    describe('Blog Page', function() {
      beforeEach(function() {
        cy.get('#showBlogForm').click()
        cy.get('#title').type('Cypress Test Blog Title')
        cy.get('#author').type('Test Author')
        cy.get('#URL').type('https://www.example.com')
        cy.get('#createBlog').click()
      })

      it('A user can like a blog', function() {
        cy.contains('Cypress Test Blog Title').get('#showDetails').click()
        cy.get('#likeButton').click()
        cy.contains('Likes: 1')
      })

      it('A user can delete a blog', function() {
        cy.contains('Cypress Test Blog Title').get('#showDetails').click()
        cy.get('#deleteblog').click()
        cy.on('window:confirm', () => true)
        cy.contains('Cypress Blog Title').should('not.exist')
      })

      it('only the user who create the blog can delete it', function(){
        cy.get('#logout').click()
        cy.get('#username').type('anna')
        cy.get('#password').type('anna')
        cy.get('button[type="submit"]').click()
        cy.contains('Cypress Test Blog Title').get('#showDetails').click()
        cy.get('#deleteblog').click()
        cy.on('window:confirm', () => true)
        cy.contains('Cypress Blog Title')
      })

      it('Blogs are ordered by likes, with the most liked blog being first', function() {
        cy.get('.blog').should('have.length', 3).then($blogs => {
          const likeCounts = $blogs.map((index, element) => {
            return Cypress.$(element).find('.likes').text()
          }).get()
          const sortedLikeCounts = likeCounts.map(Number)
          const isSorted = sortedLikeCounts.every((value, index, array) => {
            if (index === 0) return true
            return value >= array[index - 1]
          })
          expect(isSorted).to.be.true
        })

      })
    })
  })
})