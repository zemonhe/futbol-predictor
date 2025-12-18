/**
 * BaseService: classe abstrata para serviços.
 * Fornece uma interface genérica para operações CRUD que outros serviços podem estender.
 * Comentários em português.
 */

export abstract class BaseService<T, ID = string> {
  /** Retorna todos os itens */
  abstract getAll(): Promise<T[]>;

  /** Retorna um item pelo id ou null se não existir */
  abstract getById(id: ID): Promise<T | null>;

  /** Cria um novo item a partir de valores parciais */
  abstract create(item: Partial<T>): Promise<T>;

  /** Atualiza um item existente */
  abstract update(id: ID, item: Partial<T>): Promise<T>;

  /** Remove um item pelo id */
  abstract delete(id: ID): Promise<void>;
}
