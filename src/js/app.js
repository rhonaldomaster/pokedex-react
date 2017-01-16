var app = function () {
  var apiUrl = '//pokeapi.co/api/v2/',
      offset = 0,
      pageItems = 100;

  var init = function () {
    renderList();
    events();
  };

  var renderList = function () {
    var Pokemon = React.createClass({
      displayName: 'Pokemon',

      render: function () {
        return React.createElement(
          'a',
          { href: '#', className: 'pokelist__link js-view-detail', 'data-poke-index': this.props.index + offset + 1 },
          React.createElement(
            'span',
            { className: 'item-number' },
            pad(this.props.index + offset + 1)
          ),
          React.createElement('img', { src: '//raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (this.props.index + offset + 1) + '.png', className: 'mini-sprite', alt: this.props.name }),
          React.createElement(
            'span',
            { className: 'item-name' },
            this.props.name
          )
        );
      }
    });
    var List = React.createClass({
      displayName: 'List',

      getInitialState: function () {
        return { list: [] };
      },
      componentDidMount: function () {
        this.fetchList();
      },
      render: function () {
        return React.createElement(
          'div',
          { className: 'pokelist relative' },
          offset > 0 ? React.createElement(
            'button',
            { className: 'button button--primary button--previous js-prev' },
            '<'
          ) : '',
          React.createElement(
            'ul',
            { className: 'list-unstyled' },
            this.state.list.map(function (poke, index) {
              return React.createElement(
                'li',
                { 'class': 'pokelist__item' },
                React.createElement(Pokemon, { index: index, name: poke.name })
              );
            })
          ),
          React.createElement(
            'button',
            { className: 'button button--primary button--next js-next' },
            '>'
          )
        );
      },
      fetchList: function () {
        var url = apiUrl + 'pokemon/?limit=' + pageItems + '&offset=' + offset;
        var elem = this;
        ajax({ method: 'get', url: url }, function (data) {
          var info = JSON.parse(data);
          elem.setState({ list: info.results });
        });
      }
    });
    ReactDOM.render(React.createElement(List, null), document.querySelector('.js-main'));
  };

  var prevPage = function () {
    if (offset >= pageItems) {
      offset -= pageItems;
    } else {
      offset = 0;
    }
    renderList();
  };

  var nextPage = function () {
    offset += pageItems;
    renderList();
  };

  var pad = function (num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  };

  var viewDetail = function (ev) {
    ev.preventDefault();
    var clickedElement = null;
    if (ev.srcElement) clickedElement = ev.srcElement;else if (ev.target) clickedElement = ev.target;
    if (clickedElement.tagName.toLowerCase() === 'span') {
      clickedElement = clickedElement.parentNode;
    }
    var num = clickedElement.dataset.pokeIndex;
    var url = apiUrl + 'pokemon/' + num + '/';
    var Pokemon = React.createClass({
      displayName: 'Pokemon',

      getInitialState: function () {
        return { data: [] };
      },
      componentDidMount: function () {
        this.renderDetail();
      },
      render: function () {
        var poke = this.state.data;
        return React.createElement(
          'div',
          { className: 'poke-details' },
          React.createElement(
            'div',
            { className: 'poke-details__card' },
            React.createElement('img', { src: '//raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + poke.id + '.png', className: 'poke-details__image' }),
            React.createElement(
              'div',
              { className: 'poke-details__types' },
              poke.types ? poke.types.map(function (elem, i) {
                return React.createElement(
                  'div',
                  { className: 'type type--' + elem.type.name },
                  elem.type.name
                );
              }) : ''
            )
          ),
          React.createElement(
            'div',
            { className: 'poke-details__data' },
            React.createElement(
              'div',
              { className: 'poke-details__header' },
              React.createElement(
                'h3',
                { className: 'poke-details__title' },
                poke.num,
                ' ',
                poke.name
              )
            ),
            React.createElement(
              'div',
              { className: 'poke-details__stats' },
              React.createElement(
                'div',
                null,
                React.createElement(
                  'h4',
                  { className: 'poke-details__title' },
                  'Caracter\xEDsticas'
                ),
                React.createElement(
                  'table',
                  { className: 'stats-table' },
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Peso'
                    ),
                    React.createElement(
                      'td',
                      null,
                      poke.weight,
                      ' kg'
                    ),
                    React.createElement(
                      'th',
                      null,
                      'Altura'
                    ),
                    React.createElement(
                      'td',
                      null,
                      poke.height,
                      ' m'
                    )
                  )
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'h4',
                  { className: 'poke-details__title' },
                  'Stats base'
                ),
                React.createElement(
                  'table',
                  { className: 'stats-table' },
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Ataque'
                    ),
                    React.createElement(
                      'td',
                      null,
                      poke.atk
                    ),
                    React.createElement(
                      'th',
                      null,
                      'Defensa'
                    ),
                    React.createElement(
                      'td',
                      null,
                      poke.def
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Atq especial'
                    ),
                    React.createElement(
                      'td',
                      null,
                      poke.spatk
                    ),
                    React.createElement(
                      'th',
                      null,
                      'Def especial'
                    ),
                    React.createElement(
                      'td',
                      null,
                      poke.spdef
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Velocidad'
                    ),
                    React.createElement(
                      'td',
                      null,
                      poke.spd
                    ),
                    React.createElement(
                      'th',
                      null,
                      'Salud'
                    ),
                    React.createElement(
                      'td',
                      null,
                      poke.hp
                    )
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'poke-details__abilities' },
                React.createElement(
                  'h4',
                  { className: 'poke-details__title' },
                  'Habilidades'
                ),
                React.createElement(
                  'ul',
                  { className: 'list--unstyled' },
                  poke.abilities ? poke.abilities.map(function (elem, i) {
                    return React.createElement(
                      'li',
                      null,
                      React.createElement(
                        'a',
                        { href: elem.ability.url, target: '_blank', rel: 'nofollow' },
                        elem.ability.name
                      )
                    );
                  }) : ''
                )
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'poke-details__moves' },
            React.createElement(
              'h3',
              { className: 'poke-details__title' },
              'Movimientos'
            ),
            React.createElement(
              'ul',
              { className: 'poke-moves list--unstyled' },
              poke.moves ? poke.moves.map(function (elem, i) {
                return React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'h4',
                    { className: 'poke-details__title poke-moves__move-title' },
                    elem.move.name
                  ),
                  React.createElement(
                    'table',
                    { className: 'moves-table' },
                    React.createElement(
                      'thead',
                      null,
                      React.createElement(
                        'tr',
                        null,
                        React.createElement(
                          'th',
                          null,
                          'Nivel'
                        ),
                        React.createElement(
                          'th',
                          null,
                          'M\xE9todo'
                        ),
                        React.createElement(
                          'th',
                          null,
                          'Versi\xF3n'
                        )
                      )
                    ),
                    React.createElement(
                      'tbody',
                      null,
                      elem.version_group_details ? elem.version_group_details.map(function (versionDetail, i2) {
                        return React.createElement(
                          'tr',
                          null,
                          React.createElement(
                            'td',
                            null,
                            versionDetail.level_learned_at
                          ),
                          React.createElement(
                            'td',
                            null,
                            versionDetail.move_learn_method.name
                          ),
                          React.createElement(
                            'td',
                            null,
                            versionDetail.version_group.name
                          )
                        );
                      }) : ''
                    )
                  )
                );
              }) : ''
            )
          ),
          React.createElement(
            'div',
            { className: 'poke-details__nav' },
            React.createElement(
              'a',
              { href: '#', className: 'js-back' },
              'Regresar a listado'
            )
          )
        );
      },
      renderDetail: function () {
        var elem = this;
        ajax({ method: 'get', url: url }, function (data) {
          var resp = JSON.parse(data);
          var pokemon = {
            id: num * 1, num: pad(num, 3), name: resp.name, types: resp.types.reverse(), weight: resp.weight / 10,
            height: resp.height / 10, abilities: resp.abilities, moves: resp.moves,
            atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0, hp: 0
          };
          var val = null;
          for (var i = 0; i < resp.stats.length; i++) {
            val = resp.stats[i];
            if (val.stat.name == 'attack') pokemon.atk = val.base_stat;
            if (val.stat.name == 'defense') pokemon.def = val.base_stat;
            if (val.stat.name == 'special-attack') pokemon.spatk = val.base_stat;
            if (val.stat.name == 'special-defense') pokemon.spdef = val.base_stat;
            if (val.stat.name == 'speed') pokemon.spd = val.base_stat;
            if (val.stat.name == 'hp') pokemon.hp = val.base_stat;
          }
          elem.setState({ data: pokemon });
        });
      }
    });
    ReactDOM.render(React.createElement(Pokemon, null), document.querySelector('.js-main'));
  };

  var ajax = function (params, callback) {
    var req = null;
    if (window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    req.onreadystatechange = function () {
      if (req.readyState == XMLHttpRequest.DONE) {
        callback(req.responseText);
      }
    };
    req.open(params.method, params.url, true);
    req.send(params.data);
  };

  var events = function () {
    document.addEventListener('click', function (ev) {
      var elem = null;
      if (ev.srcElement) elem = ev.srcElement;else if (ev.target) elem = ev.target;
      if (elem.className.indexOf('js-view-detail') > -1) {
        viewDetail(ev);
      } else if (elem.className.indexOf('js-prev') > -1) {
        prevPage(ev);
      } else if (elem.className.indexOf('js-next') > -1) {
        nextPage(ev);
      } else if (elem.className.indexOf('js-back') > -1) {
        renderList();
      }
    });
  };

  return {
    init: init
  };
}();

app.init();