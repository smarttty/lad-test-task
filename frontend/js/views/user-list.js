export default () => /*html*/`
    <div class="login-block">
            <div class="login-image"></div>
            <div class="login-form">
                <div class="login-menu">
                    <button class="login-menu-button"></button>
                </div>
                <div class="login-inputs">
                    <form>
                        <i class="login-icon icon-globe"></i>
                        <h2>Welcome back!</h2>
                        <h4>log into your dashboard</h4>
                        <div class="row login">
                            <i class="login-form-icon icon-login"></i>
                            <input type="text" id="login" class="login"  autocomplete="off">
                        </div>
                        <div class="row password">
                            <i class="login-form-icon icon-password"></i>
                            <input type="password" id="password" class="password"  autocomplete="off">
                        </div>
                        <div class="row line">
                            <input type="checkbox" id="stay-logged">
                            <label for="stay-logged" class="checkbox">stay logged in</label>
                        </div>
                        <div class="row">
                            <button class="login-button">
                                login
                                <i class="icon-arrow-right"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
`;