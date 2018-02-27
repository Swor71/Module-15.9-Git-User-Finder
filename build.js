'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        _this.state = {
            searchText: '',
            users: []
        };
        return _this;
    }

    _createClass(App, [{
        key: 'onChangeHandle',
        value: function onChangeHandle(e) {
            this.setState({ searchText: e.target.value });
        }
    }, {
        key: 'onSubmit',
        value: function onSubmit(e) {
            var _this2 = this;

            e.preventDefault();
            var searchText = this.state.searchText;

            var url = 'http://cors-anywhere.herokuapp.com/https://api.github.com/search/users?q=' + searchText;
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (responseJSON) {
                var users = responseJSON.items;

                var promises = users.map(function (user) {
                    return fetch(user.organizations_url).then(function (res) {
                        return res.json();
                    }).then(function (data) {
                        user.orgs = data;

                        return user;
                    });
                });

                Promise.all(promises).then(function (users) {
                    console.log(users);
                    _this2.setState({ users: users });
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return React.createElement(
                'div',
                { className: 'search-bar' },
                React.createElement(
                    'form',
                    { onSubmit: function onSubmit(e) {
                            return _this3.onSubmit(e);
                        } },
                    React.createElement(
                        'label',
                        { htmlFor: 'searchText' },
                        ' Search by User Name: '
                    ),
                    React.createElement('input', {
                        type: 'text',
                        id: 'searchText',
                        onChange: function onChange(e) {
                            return _this3.onChangeHandle(e);
                        },
                        value: this.state.searchText })
                ),
                React.createElement(UserList, { users: this.state.users })
            );
        }
    }]);

    return App;
}(React.Component);

var UserList = function UserList(props) {
    return React.createElement(
        'div',
        { className: 'container' },
        props.users.map(function (user) {
            return React.createElement(User, { key: user.id, user: user });
        })
    );
};

var User = function User(props) {
    return React.createElement(
        'div',
        { className: 'user-info' },
        React.createElement('img', { className: 'avatar', src: props.user.avatar_url, style: { maxWidth: '150px' } }),
        React.createElement(
            'a',
            { className: 'user-nickname', href: props.user.html_url, target: '_blank' },
            props.user.login
        ),
        React.createElement(
            'div',
            { className: 'orgList' },
            props.user.orgs.map(function (org) {
                return React.createElement(OrgAvatar, { key: org.id, avatar_url: org.avatar_url });
            })
        )
    );
};

var OrgAvatar = function OrgAvatar(props) {
    return React.createElement('img', { className: 'orgAvatar', src: props.avatar_url });
};

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
