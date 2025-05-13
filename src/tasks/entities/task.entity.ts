import { Accountant } from "src/accountants/entities/accountant.entity";
import { Receptionist } from "src/receptionists/entities/receptionist.entity";
import { Technician } from "src/technicians/entities/technician.entity";
import { Check, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Check(`("receptionistId" IS NOT NULL AND "accountantId" IS NULL AND "technician" IS NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NOT NULL AND "technician" IS NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NULL AND "technician" IS NOT NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NULL AND "technician" IS NULL)`)
@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column({ default: false })
    isComplete: boolean

    @Column()
    deadline: Date

    @ManyToOne(() => Receptionist, receptionist => receptionist.tasks, { nullable: true, onDelete: "SET NULL" })
    receptionist: Receptionist

    @ManyToOne(() => Accountant, accountant => accountant.tasks, { nullable: true, onDelete: "SET NULL" })
    accountant: Accountant

    @ManyToOne(() => Technician, technician => technician.tasks, { nullable: true, onDelete: "SET NULL" })
    technician: Technician

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
