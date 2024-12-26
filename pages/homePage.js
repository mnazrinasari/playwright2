class HomePage {
    constructor(page) {
        this.page = page;
        this.signupName = page.locator("[data-qa='signup-name']");
        this.signupEmail = page.locator("[data-qa='signup-email']");
        this.signupButton = page.locator("[data-qa='signup-button']");
        this.loginUsername = page.locator('[data-qa="login-email"]');
        this.loginPassword = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('[data-qa="login-button"]');
        this.productCards = page.locator('[class="product-image-wrapper"]');
        this.allProducts = page.locator("[class='single-products']");
        this.continueModal = page.locator("[class='btn btn-success close-modal btn-block']");
        this.viewCartModal = page.locator("p a");
        this.deleteAccountMessage = page.getByRole('heading', { name: 'Account Deleted!' });
        this.deleteConfirmButton = page.locator("[data-qa='continue-button']");
        this.loggedinUser = page.locator("li:has-text('Logged in as')");

        // Menu Locators
        this.homepage = page.locator('[href="/"]').first();
        this.login = page.locator("[href='/login']");
        this.product = page.locator("[href='/products']");
        this.cart = page.locator("[href='/view_cart']").first();
        this.deleteAccountButton = page.locator("[href='/delete_account']");
    }

    // Method to visit a page
    async navigateToPage(section) {
        switch (section) {
            case 'homepage':
                await this.homepage.click();
                break;
            case 'login':
                await this.login.click();
                break;
            case 'product':
                await this.product.click();
                break;
            case 'cart':
                await this.cart.click();
                break;
            case 'deleteAccount':
                await this.deleteAccountButton.click();
                break;
            default:
                throw new Error('Invalid section provided');
        }
    }

    // Log in with provided username and password
    async loginExistingUser(username, password) {
        await this.loginUsername.fill(username);
        await this.loginPassword.fill(password);
        await this.loginButton.click();
    }

    // Add product to the cart based on the provided data
    async addProductToCart(randomProductData) {
        let productAddedtoCart = [];
        const productCard = await this.productCards;
        const allProductsCounts = await productCard.count();

        // Selecting product and view the PDP
        for (let i = 0; i < allProductsCounts; i++) {
            const singleProduct = await productCard.nth(i).locator('div p').nth(0).textContent();
            for (const product of randomProductData) {
                if (!productAddedtoCart.includes(product) && singleProduct === product) {
                    productAddedtoCart.push(product);
                    const homeThumbnail = await productCard.nth(i).locator('div img').getAttribute('src');
                    await productCard.nth(i).locator('div a').nth(0).click();
                    if (productAddedtoCart.length < randomProductData.length) {
                        const modal = this.continueModal;
                        await modal.waitFor({ state: 'visible' });
                        await modal.click();
                        console.log("clicked");
                    } else {
                        const modal = this.viewCartModal;
                        await modal.waitFor({ state: 'visible' });
                        await modal.click();
                        console.log("last product clicked");
                    }
                    break;
                }
            }

            if (productAddedtoCart.length === randomProductData.length) {
                break;
            }
        }
    }
}

module.exports = { HomePage };