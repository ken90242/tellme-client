// import Paper from './Menu';
import React from 'react';
import { Breadcrumb } from 'element-react';
import { Link } from "react-router-dom";
import './Menu.css'
import { matchRoutes } from 'react-router-config';
import routes from '../../router';



class TMBreadcrumb extends React.Component {
  render() {
    let matchedRoutes = matchRoutes(routes, this.props.currentPath);
    matchedRoutes = [
      {
        route: {
          path: '/',
          breadcrumbName: 'Home'
        }
      },
      ...matchedRoutes
    ];
    return (
      <div className="Breadcrumb-wrapper">
        <Breadcrumb separator="/">
          <Breadcrumb.Item className="bread"><Link className="bread" to=''>Home</Link></Breadcrumb.Item>
          {
            matchedRoutes.map((matchRoute, i) => {
              const { path, breadcrumbName } = matchRoute.route;

              if (breadcrumbName === 'Home') {
                return null;
              }
              else if (matchRoute.match.isExact) {
                return (
                  <Breadcrumb.Item className="bread" key={i}>
                    {matchRoute.match.params.id ? matchRoute.match.params.id : breadcrumbName}
                  </Breadcrumb.Item>
                )
              }
              return (
                <Breadcrumb.Item className="bread" key={i}>
                  <Link className="bread" to={path}>
                    { breadcrumbName }
                  </Link>
                </Breadcrumb.Item>
              );
            })
          }
        </Breadcrumb>
      </div>
    )
  }
}


export {
  TMBreadcrumb
};

