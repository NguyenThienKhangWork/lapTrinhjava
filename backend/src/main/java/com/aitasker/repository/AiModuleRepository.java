package com.aitasker.repository;

import com.aitasker.entity.AiModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiModuleRepository extends JpaRepository<AiModule, Long> {
    Optional<AiModule> findByName(String name);
}
