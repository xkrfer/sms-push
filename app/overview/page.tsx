import List from "./components/list";
import SSummary from "./components/s-summary";
import Search from "./components/search";

export default async function Page({
    searchParams
  }: {
    searchParams: { q: string, p: string };
  }) {
  return (
    <div>
      <SSummary />
      <Search />
      <List searchParams={searchParams}/>
    </div>
  );
}
