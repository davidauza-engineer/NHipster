export interface IDomain {
  id?: number;
  name?: string | null;
}

export class Domain implements IDomain {
  constructor(public id?: number, public name?: string | null) {}
}

export function getDomainIdentifier(domain: IDomain): number | undefined {
  return domain.id;
}
