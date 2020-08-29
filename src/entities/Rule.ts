import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['guild', 'reddit'])
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reddit: string;

  @Column({ length: 20 })
  guild: string;

  @Column({ length: 20 })
  publicChan: string;

  @Column({ length: 20, nullable: true })
  modChan?: string;

  @Column({ nullable: true })
  automodDelay?: number;

  @Column()
  icon: string;
}
