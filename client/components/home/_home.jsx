import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiContext } from '../../utils/api_context';
import { AuthContext } from '../../utils/auth_context';
import { RolesContext } from '../../utils/roles_context';
import { Button } from '../common/button';
import { useList } from '../../utils/useList';

export const Home = () => {
  const [item, setItem] = useState('');
  const [items, addItem, updateItemStatus] = useList();
  const [myItems, setMyItems] = useState([]);
  const [, setAuthToken] = useContext(AuthContext);
  const api = useContext(ApiContext);
  const roles = useContext(RolesContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(async () => {
    const res = await api.get('/users/me');
    setUser(res.user);
    setLoading(false);
  }, []);

  const logout = async () => {
    const res = await api.del('/sessions');
    if (res.success) {
      setAuthToken(null);
    }
  };

  const updateItems = () => {
    temp = [];
    items.forEach((x, i) => {
      if (x.userID == user.id) {
        temp.push(x);
      }
    });
    setMyItems(temp);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-zinc-700">
      <h1>
        Welcome {user.firstName} {user.id}
      </h1>
      <Button type="button" onClick={logout}>
        Logout
      </Button>
      {roles.includes('admin') && (
        <Button type="button" onClick={() => navigate('/admin')}>
          Admin
        </Button>
      )}

      <div className="App">
        <input type="text" value={item} onChange={(e) => setItem(e.target.value)} />
      </div>
      <Button
        onClick={() => {
          addItem(item, user.id);
        }}
      >
        SAVE
      </Button>

      <div>
        {items
          .filter((item) => item.userID === user.id && item.isCompleted != true)
          .map((filteredItem) => (
            <div key={filteredItem.id}>
              <input
                type="checkbox"
                checked={filteredItem.isCompleted}
                onChange={() => updateItemStatus(filteredItem)}
              />{' '}
              {filteredItem.item}
            </div>
          ))}
      </div>
    </div>
  );
};
