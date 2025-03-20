'use client';

import {
  Column,
  DataGrid,
  FilterRow,
  HeaderFilter,
  Paging,
  SearchPanel,
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.material.blue.light.css';
import moment from 'moment';
import React, { useEffect } from 'react';

import useAuthStore from '../store/store';

const BooksTable = () => {
  const { books, fetchBooks, loading, error } = useAuthStore();

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold mt-5">Loading books...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 font-semibold mt-5">{error}</p>
    );

  return (
    <div className="p-6 w-full bg-white shadow-lg rounded-xl mt-14">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📚 Books List
      </h2>
      <DataGrid
        dataSource={books}
        keyExpr="id"
        showBorders={true}
        columnAutoWidth={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        className="border rounded-lg"
      >
        <SearchPanel visible={true} highlightCaseSensitive={false} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />

        <Column dataField="id" caption="ID" width={70} />
        <Column dataField="name" caption="Name" />
        <Column dataField="author" caption="Author" />
        <Column dataField="publisher" caption="Publisher" />
        <Column dataField="isbn" caption="ISBN" />
        <Column dataField="category" caption="Category" />
        <Column
          dataField="created_at"
          caption="Created At"
          cellRender={({ value }) => moment(value).format('DD-MM-YYYY HH:mm')}
        />
        <Column
          dataField="updated_at"
          caption="Updated At"
          cellRender={({ value }) => moment(value).format('DD-MM-YYYY HH:mm')}
        />

        <Paging defaultPageSize={5} />
      </DataGrid>
    </div>
  );
};

export default BooksTable;
