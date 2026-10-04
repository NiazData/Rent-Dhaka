import { getTeamMembers } from "../lib/content-repository";

export function TeamGrid() {
  const team = getTeamMembers();

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {team.map((member) => (
        <div key={member.id} className="text-center">
          <img
            src={member.photo}
            alt={member.name}
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
          <p className="mt-3 font-semibold text-stone-900">{member.name}</p>
          <p className="text-sm text-stone-600">{member.role}</p>
          <p className="mt-2 text-sm text-stone-600">{member.bio}</p>
        </div>
      ))}
    </div>
  );
}
